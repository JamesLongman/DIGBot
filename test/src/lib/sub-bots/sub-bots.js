//  Copyright © 2018 DIG Development team. All rights reserved.

const should = require('chai').should();

const config = require('../../../../config/config.js');
const subBots = require('../../../../src/lib/sub-bots/sub-bots.js');

describe('sub-bots/sub-bots.js', function() {
    const original = config.getConfig().subBots;

    it('should have the function "logout"', function() {
        subBots.should.have.property('logout');
        subBots.logout.should.be.a('function');
    });

    it('should have the function "passBot"', function() {
        subBots.should.have.property('passBot');
        subBots.passBot.should.be.a('function');
    });

    it('should have the function "ready"', function() {
        subBots.should.have.property('ready');
        subBots.ready.should.be.a('function');
    });

    it('subBots should have correct properties', function() {
        if (!original) { this.skip(); }
        original.should.be.a('object');
        for (let x in original) {
            original[x].booted.should.be.a('boolean');
            original[x].booted.should.be.a('boolean');
            original[x].id.should.be.a('string');
            original[x].token.should.be.a('string');
        }
    });

    describe('log a subBot in and out', function() {
        let bot = false;

        before(function(done) {
            this.timeout(10000);
            subBots.passBot()
                .then(passed => {
                    bot = passed;
                    done();
                })
                .catch(err => {
                    console.log(err);
                    done();
                });
        });

        it('bot should have logged in correctly', function() {
            bot.should.not.be.false;
            bot.user.id.should.be.a('string');
        });

        it('subBot module should accept bot to log out', function() {
            subBots.logout(bot).should.be.true;
        });
    });

    describe('test passBot rejection due to disabled feature', function() {
        let result = false;

        before(function(done) {
            result = false;
            config.setProperty('subBots', false);
            subBots.passBot()
                .then(passed => {
                    subBots.logout(passed);
                    config.setProperty('subBots', original);
                    done();
                })
                .catch(err => {
                    result = err;
                    config.setProperty('subBots', original);
                    done();
                });
        });

        it('should reject if feature disabled', function() {
            result.should.not.be.false;
            result.should.eql('The sub bot feature is disabled or there are no subBots on file');
        });
    });

    describe('test passBot rejection due to exceeded limit', function() {
        const limit = config.getConfig().subBotLimit;
        let result = false;

        before(function(done) {
            result = false;
            config.setProperty('subBotLimit', -1);
            subBots.passBot()
                .then(passed => {
                    subBots.logout(passed);
                    config.setProperty('subBotLimit', limit);
                    done();
                })
                .catch(err => {
                    result = err;
                    config.setProperty('subBotLimit', limit);
                    done();
                });
        });

        it('should reject if feature disabled', function() {
            result.should.not.be.false;
            result.should.eql('The maximum number of subBots are currently running');
        });
    });
});