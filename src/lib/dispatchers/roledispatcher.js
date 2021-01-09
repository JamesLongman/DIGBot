const config = require('config');
const { template } = require('lodash');

const Dispatcher = require('../foundation/dispatcher');

module.exports = class RoleDispatcher extends Dispatcher {
    /**
     * @param discordjsClient
     * @param logger
     */
    constructor({ discordjsClient }) {
        super();

        this.client = discordjsClient;
    }

    /**
     * @return {Promise<void>}
     */
    async start() {
        this.registerListenersTo(this.client, {
            guildMemberUpdate: this.memberUpdate.bind(this),
        });
    }

    /**
     * @return {Promise<void>}
     */
    async stop() {
        this.unregisterListenersFromAll();
    }

    /**
     *
     * @param old
     * @param member
     */
    memberUpdate(old, member) {
        if (member.user.bot) {
            return;
        }

        const addedRoles = member.roles.filter(r => !old.roles.has(r.id));

        addedRoles.forEach(role => this.roleAdded(role, member));
    }

    /**
     *
     * @param role
     * @param member
     */
    roleAdded(role, member) {
        if (config.has(`guilds.${member.guild.id}.onRoleAssignment.${role.id}`)) {
            config.get(`guilds.${member.guild.id}.onRoleAssignment.${role.id}`)
                .forEach(action => this.executeAction(action, role, member));
        }
    }

    /**
     * TODO: Not the best way, but it will suffice for now
     *  Probably a good idea to introduce a queue
     *
     * @param action
     * @param role
     * @param member
     */
    executeAction(action, role, member) {
        switch (action.type) {
        case 'message':
            this.client.channels.get(action.channel).send(template(action.content)({
                role,
                member,
            }));
            break;
        case 'dm':
            member.send(template(action.content)({
                role,
                member,
            }));
            break;
        default:
            throw new Error(`Action type unkown: ${action.type}`);
        }
    }
};
