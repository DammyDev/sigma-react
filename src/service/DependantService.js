import axios from 'axios';

export class DependantService {


    getDependants() {
        return axios.get('assets/demo/data/dependants.json').then(res => res.data.data);
    }

}