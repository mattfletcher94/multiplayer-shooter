import { shallowMount, createLocalVue } from '@vue/test-utils'
import LobbyCard from '@/components/LobbyCard.vue'
import BootstrapVue from 'bootstrap-vue'
import moment from 'moment'
import lobby from '../modelMocks/lobby'

const createComponent = (props = {}) => {
    const localVue = createLocalVue()
    localVue.use(BootstrapVue);
    return shallowMount(LobbyCard, {
        localVue: localVue,
        propsData: {
            ...props
        }
    });
}


describe('LobbyCard.vue', () => {

    it('Displays lobby map title correctly.', () => {
        const component = createComponent({ lobby: lobby });
        expect(component.find('.lobby-title').text()).toMatch(lobby.gameMap.mapTitle);
    });

    it('Displays lobby description correctly.', () => {
        const component = createComponent({ lobby: lobby });
        expect(component.find('.lobby-desc').text()).toMatch(`${lobby.gameMode.gameModeTitle} · ${lobby.gameMaxPlayers} Max Players`);
    });

    it('Displays lobby map image correctly.', () => {
        const component = createComponent({ lobby: lobby });
        expect(component.find('.lobby-img').attributes().style).toMatch(`background-image: url(${lobby.gameMap.mapTexturePath});`);
    });
    
    it('Displays countdown timer correctly when the lobby has not started.', () => {

        // Set lobby to start in the future
        lobby.gameStartDatetime = new moment(moment(), "YYYY-MM-DDTHH:mm").utc().add(10, "minutes");
        lobby.gameEndDatetime = new moment(moment(), "YYYY-MM-DDTHH:mm").utc().add(20, "minutes");

        // Create component
        const component = createComponent({ lobby: lobby });

        // Run test
        expect(component.find('.lobby-timeago').text()).toMatch("Game starts in: " + moment(lobby.gameStartDatetime).fromNow(true));
    });
    
    it('Displays countdown timer correctly when the lobby has started and has not ended.', () => {

        // Set lobby to start in the future
        lobby.gameStartDatetime = new moment(moment(), "YYYY-MM-DDTHH:mm").utc().add(-10, "minutes");
        lobby.gameEndDatetime = new moment(moment(), "YYYY-MM-DDTHH:mm").utc().add(10, "minutes");

        // Create component
        const component = createComponent({ lobby: lobby });

        // Run test
        expect(component.find('.lobby-timeago').text()).toMatch("Time remaining: " + moment(lobby.gameEndDatetime).fromNow(true));
    });
   
    it('Displays countdown timer correctly when the lobby has ended.', () => {

        // Set lobby to start in the future
        lobby.gameStartDatetime = new moment(moment(), "YYYY-MM-DDTHH:mm").utc().add(-20, "minutes");
        lobby.gameEndDatetime = new moment(moment(), "YYYY-MM-DDTHH:mm").utc().add(-10, "minutes");

        // Create component
        const component = createComponent({ lobby: lobby });

        // Run test
        expect(component.find('.lobby-timeago').text()).toMatch("EXPIRED");
    });

    
    it('Checks the JOIN lobby button URL directs to the correct location.', () => {
        const component = createComponent({ lobby: lobby });
        expect(component.find('.lobby-join-btn').attributes().to).toMatch(`/dashboard/game/${lobby._id}`);
    });

});
