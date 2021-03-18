import axios from 'axios'

export class StateService {

    getStates() {
        return axios.get('assets/demo/data/states.json')
            .then(res => res.data);
    }
}