import { PortalClient } from "@subsquid/portal-client";
import { HttpClient } from "@subsquid/http-client";

export abstract class BasePipe<FetchParams, FetchResponse> {
  private static readonly MIN_BYTES = 1 * 1024 * 1024;
  private static readonly RETRY_ATTEMPTS = 3;

  constructor(protected portalUrl: string) {}

  public abstract stream(
    params: FetchParams
  ): Promise<ReadableStream<FetchResponse>>;

  public get portalClient() {
    const portalClient = new PortalClient({
      url: this.portalUrl,
      http: new HttpClient({
        retryAttempts: BasePipe.RETRY_ATTEMPTS,
      }),
      minBytes: BasePipe.MIN_BYTES,
    });

    return portalClient;
  }
}
