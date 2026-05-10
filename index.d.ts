import type { PublishCommandInput } from "@aws-sdk/client-sns";

export interface CriticalOptions extends Omit<PublishCommandInput, 'Message'> {
    region?: string;
    Subject?: string;
}

export interface CriticalHandle {
    (messageOrError: unknown): void;

    configure(options: CriticalOptions): void;

    waitForCompletion(): Promise<void>;
    waitForCompletion(cb: () => void): void;
}

declare const critical: CriticalHandle;

export = critical;
