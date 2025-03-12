import { PortalResponse, PortalStreamData } from "@subsquid/portal-client";
import { BasePipe } from "./base.pipe";

// Define proper interfaces for events
interface EventHandler {
  is(log: LogData): boolean;
  decode(log: LogData): any;
  signature: string;
  topic: string;
}

interface EventDefinition {
  [eventName: string]: EventHandler;
}

interface BlockData extends PortalResponse {
  transactions: {
    hash: string;
  }[];
  logs: LogData[];
}

interface LogData {
  address: string;
  topics: string[];
  data: string;
  transactionHash: string;
  logIndex: number;
}

export interface Filters {
  /**
   * Block number to start processing from (required)
   */
  startBlock: number;
  /**
   * Block number to stop processing at (optional)
   */
  endBlock?: number;
  /**
   * Array of contract addresses to filter by (optional)
   */
  contractAddresses?: string[];
  /**
   * Transaction sender address (optional)
   */
  from?: string;
  /**
   * Transaction recipient address (optional)
   */
  to?: string;
}

// Define what a decoded event should look like
export interface DecodedEvent {
  // Blockchain data
  address: string;
  blockNumber: number;
  txHash: string;
  // Event metadata
  type: string;
  signature: string;
  topic: string;
  // Event parameters
  [key: string]: any;
}

export interface EventDecodingPipeOptions {
  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

export class EventDecodingPipe<Event extends EventDefinition> extends BasePipe<
  Filters,
  DecodedEvent[]
> {
  private events: Event[];
  private options: Required<EventDecodingPipeOptions>;

  // Event topic to handler mapping for faster lookups
  private topicMap: Map<
    string,
    Array<{ eventName: string; handler: EventHandler }>
  > = new Map();

  // Default options
  private static readonly DEFAULT_OPTIONS: Required<EventDecodingPipeOptions> =
    {
      debug: false,
    };

  /**
   * Creates a new EventDecodingPipe
   * @param portalUrl - URL of the Subsquid Portal instance
   * @param events - Array of event definitions to decode
   * @param options - Optional configuration settings
   */
  constructor(
    portalUrl: string,
    events: Event[],
    options: EventDecodingPipeOptions = {}
  ) {
    super(portalUrl);
    this.events = events;
    this.options = { ...EventDecodingPipe.DEFAULT_OPTIONS, ...options };

    // Initialize topic map for faster event matching
    this.initializeTopicMap();
  }

  /**
   * Initialize a map of topics to event handlers for faster matching
   */
  private initializeTopicMap(): void {
    this.events.forEach((event) => {
      Object.entries(event).forEach(([eventName, handler]) => {
        const topic = handler.topic;
        if (!this.topicMap.has(topic)) {
          this.topicMap.set(topic, []);
        }
        this.topicMap.get(topic)!.push({ eventName, handler });
      });
    });

    this.logDebug(
      `Initialized topic map with ${this.topicMap.size} unique topics`
    );
  }

  /**
   * Stream and decode events matching the provided filters
   * @param params - Filtering parameters
   * @returns A stream of decoded events
   */
  async stream(params: Filters): Promise<ReadableStream<DecodedEvent[]>> {
    try {
      return this.getStream(params).pipeThrough(
        new TransformStream<PortalStreamData<BlockData>, DecodedEvent[]>({
          transform: (data, controller) => {
            try {
              this.processBlocks(data, controller);
            } catch (error) {
              this.logError("Error processing blocks", error);
              // Don't terminate the stream on transform errors
              // Just skip this batch of events
            }
          },
        })
      );
    } catch (error) {
      this.logError("Failed to create stream", error);
      throw error;
    }
  }

  /**
   * Process blocks from the stream
   */
  private processBlocks(
    { blocks }: PortalStreamData<BlockData>,
    controller: TransformStreamDefaultController<DecodedEvent[]>
  ): void {
    if (!blocks || !blocks.length) return;

    try {
      const startTime = Date.now();

      const decodedEvents = this.processBatch(blocks);

      if (decodedEvents.length > 0) {
        controller.enqueue(decodedEvents);
      }

      const endTime = Date.now();
      this.logDebug(
        `Processed ${blocks.length} blocks in ${endTime - startTime}ms`
      );
    } catch (error) {
      this.logError("Error processing blocks", error);
    }
  }

  /**
   * Process a batch of blocks
   */
  private processBatch(blocks: BlockData[]): DecodedEvent[] {
    const decodedEvents: DecodedEvent[] = [];

    for (const block of blocks) {
      if (!block.logs || block.logs.length === 0) continue;

      this.logDebug(
        `Processing ${block.logs.length} logs from block ${block.header.number}`
      );

      for (const log of block.logs) {
        const events = this.decodeLog(log, block.header.number);
        if (events.length > 0) {
          decodedEvents.push(...events);
        }
      }
    }

    return decodedEvents;
  }

  /**
   * Decode a single log entry using the registered event handlers
   */
  private decodeLog(log: LogData, blockNumber: number): DecodedEvent[] {
    try {
      // Fast lookup using the topic map
      if (log.topics.length > 0) {
        const topic0 = log.topics[0];
        const handlers = this.topicMap.get(topic0);

        if (!handlers || handlers.length === 0) {
          return [];
        }

        return handlers
          .flatMap(({ eventName, handler }) => {
            try {
              if (handler.is(log)) {
                const decodedEvent = handler.decode(log);
                return {
                  ...decodedEvent,
                  address: log.address,
                  blockNumber,
                  txHash: log.transactionHash,
                  type: eventName,
                  signature: handler.signature,
                  topic: handler.topic,
                };
              }
            } catch (error) {
              this.logError(`Error decoding event ${eventName}`, error);
            }
            return null;
          })
          .filter(Boolean) as DecodedEvent[];
      }

      // Fallback to scanning all events if no topic match
      return this.events.flatMap((event) => {
        return Object.entries(event)
          .map(([eventName, handler]) => {
            try {
              if (handler.is(log)) {
                const decodedEvent = handler.decode(log);
                return {
                  ...decodedEvent,
                  address: log.address,
                  blockNumber,
                  txHash: log.transactionHash,
                  type: eventName,
                  signature: handler.signature,
                  topic: handler.topic,
                };
              }
            } catch (error) {
              this.logError(`Error decoding event ${eventName}`, error);
            }
            return null;
          })
          .filter(Boolean) as DecodedEvent[];
      });
    } catch (error) {
      this.logError("Error in log decoding", error);
      return [];
    }
  }

  /**
   * Create the data stream from Subsquid Portal
   */
  private getStream(params: Filters) {
    // Use the topic map keys for better performance
    const topics = Array.from(this.topicMap.keys());

    this.logDebug(
      `Setting up stream from block ${params.startBlock} with ${topics.length} topics`
    );

    return this.portalClient.getStream({
      type: "evm",
      fromBlock: params.startBlock,
      toBlock: params.endBlock,
      fields: {
        block: {
          number: true,
          hash: true,
          timestamp: true,
        },
        log: {
          address: true,
          topics: true,
          data: true,
          transactionHash: true,
          logIndex: true,
          transactionIndex: true,
        },
      },
      logs: [
        {
          address: params.contractAddresses,
          topic0: topics,
          transaction: true,
        },
      ],
    });
  }

  private logDebug(message: string): void {
    if (this.options.debug) {
      console.debug(`[EventDecodingPipe] ${message}`);
    }
  }

  private logError(message: string, error: unknown): void {
    console.error(`[EventDecodingPipe] ${message}:`, error);
  }
}
