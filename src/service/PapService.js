import axios from 'axios';

export class PapService {


    getPaps() {
        return axios.get('assets/demo/data/paps.json').then(res => res.data);
    }

}