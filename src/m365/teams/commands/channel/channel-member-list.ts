import { Channel, ConversationMember, Group } from '@microsoft/microsoft-graph-types';
import GlobalOptions from '../../../../GlobalOptions.js';
import { Logger } from '../../../../cli/Logger.js';
import request, { CliRequestOptions } from '../../../../request.js';
import { aadGroup } from '../../../../utils/aadGroup.js';
import { formatting } from '../../../../utils/formatting.js';
import { odata } from '../../../../utils/odata.js';
import { validation } from '../../../../utils/validation.js';
import GraphCommand from '../../../base/GraphCommand.js';
import commands from '../../commands.js';

interface ExtendedGroup extends Group {
  resourceProvisioningOptions: string[];
}

interface CommandArgs {
  options: Options;
}

interface Options extends GlobalOptions {
  teamId?: string;
  teamName?: string;
  channelId?: string;
  channelName?: string;
  role?: string;
}

class TeamsChannelMemberListCommand extends GraphCommand {
  private teamId: string = '';

  public get name(): string {
    return commands.CHANNEL_MEMBER_LIST;
  }

  public get description(): string {
    return 'Lists members of the specified Microsoft Teams team channel';
  }

  public defaultProperties(): string[] | undefined {
    return ['id', 'roles', 'displayName', 'userId', 'email'];
  }

  constructor() {
    super();

    this.#initTelemetry();
    this.#initOptions();
    this.#initValidators();
    this.#initOptionSets();
  }

  #initTelemetry(): void {
    this.telemetry.push((args: CommandArgs) => {
      Object.assign(this.telemetryProperties, {
        teamId: typeof args.options.teamId !== 'undefined',
        teamName: typeof args.options.teamName !== 'undefined',
        channelId: typeof args.options.channelId !== 'undefined',
        channelName: typeof args.options.channelName !== 'undefined',
        role: typeof args.options.role
      });
    });
  }

  #initOptions(): void {
    this.options.unshift(
      {
        option: '-i, --teamId [teamId]'
      },
      {
        option: '--teamName [teamName]'
      },
      {
        option: '-c, --channelId [channelId]'
      },
      {
        option: '--channelName [channelName]'
      },
      {
        option: '-r, --role [role]',
        autocomplete: ['owner', 'member', 'guest']
      }
    );
  }

  #initValidators(): void {
    this.validators.push(
      async (args: CommandArgs) => {
        if (args.options.teamId && !validation.isValidGuid(args.options.teamId)) {
          return `${args.options.teamId} is not a valid GUID`;
        }

        if (args.options.channelId && !validation.isValidTeamsChannelId(args.options.channelId)) {
          return `${args.options.channelId} is not a valid Teams Channel ID`;
        }

        if (args.options.role) {
          if (['owner', 'member', 'guest'].indexOf(args.options.role) === -1) {
            return `${args.options.role} is not a valid role value. Allowed values owner|member|guest`;
          }
        }

        return true;
      }
    );
  }

  #initOptionSets(): void {
    this.optionSets.push(
      { options: ['teamId', 'teamName'] },
      { options: ['channelId', 'channelName'] }
    );
  }

  public async commandAction(logger: Logger, args: CommandArgs): Promise<void> {
    try {
      this.teamId = await this.getTeamId(args);
      const channelId: string = await this.getChannelId(args);
      const endpoint = `${this.resource}/v1.0/teams/${this.teamId}/channels/${channelId}/members`;
      let memberships = await odata.getAllItems<ConversationMember>(endpoint);
      if (args.options.role) {
        if (args.options.role === 'member') {
          // Members have no role value
          memberships = memberships.filter(i => i.roles!.length === 0);
        }
        else {
          memberships = memberships.filter(i => i.roles!.indexOf(args.options.role!) !== -1);
        }
      }

      await logger.log(memberships);
    }
    catch (err: any) {
      this.handleRejectedODataJsonPromise(err);
    }
  }

  private async getTeamId(args: CommandArgs): Promise<string> {
    if (args.options.teamId) {
      return args.options.teamId;
    }

    const group = await aadGroup.getGroupByDisplayName(args.options.teamName!);
    if ((group as ExtendedGroup).resourceProvisioningOptions.indexOf('Team') === -1) {
      throw 'The specified team does not exist in the Microsoft Teams';
    }

    return group.id!;
  }

  private async getChannelId(args: CommandArgs): Promise<string> {
    if (args.options.channelId) {
      return args.options.channelId;
    }

    const channelRequestOptions: CliRequestOptions = {
      url: `${this.resource}/v1.0/teams/${formatting.encodeQueryParameter(this.teamId)}/channels?$filter=displayName eq '${formatting.encodeQueryParameter(args.options.channelName as string)}'`,
      headers: {
        accept: 'application/json;odata.metadata=none'
      },
      responseType: 'json'
    };

    const response = await request.get<{ value: Channel[] }>(channelRequestOptions);
    const channelItem: Channel | undefined = response.value[0];

    if (!channelItem) {
      throw 'The specified channel does not exist in the Microsoft Teams team';
    }

    return channelItem.id!;
  }
}

export default new TeamsChannelMemberListCommand();