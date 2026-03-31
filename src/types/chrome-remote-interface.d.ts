declare module 'chrome-remote-interface' {
  interface CDPClient {
    Runtime: {
      evaluate(params: { expression: string; returnByValue?: boolean }): Promise<{ result?: { value?: any } }>;
    };
    Network: {
      getCookies(params?: { urls?: string[] }): Promise<{ cookies: any[] }>;
      getAllCookies(): Promise<{ cookies: any[] }>;
    };
    Target: {
      getTargets(): Promise<{ targetInfos: any[] }>;
      attachToTarget(params: { targetId: string; flatten?: boolean }): Promise<{ sessionId: string }>;
      detachFromTarget(params: { sessionId: string }): Promise<void>;
    };
    Browser: {
      getVersion(): Promise<{ product: string; protocolVersion: string }>;
    };
    close(): Promise<void>;
  }

  interface CDPOptions {
    host?: string;
    port?: number;
    target?: string;
  }

  function CDP(options?: CDPOptions): Promise<CDPClient>;
  export = CDP;
}
