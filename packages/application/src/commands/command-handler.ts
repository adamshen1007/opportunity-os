import type { ApplicationCommand } from "./command.js";

export type ApplicationCommandHandler<
  TCommand extends ApplicationCommand = ApplicationCommand,
  TResult = unknown
> = {
  readonly commandName: TCommand["name"];
  execute(command: TCommand): Promise<TResult>;
};
