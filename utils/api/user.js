import { fetchJson } from './fetchJson';

const fetchUserInfo = async (user) => {
    return await fetchJson(`/api/user-data?id=${user.uid}`);
}

export { fetchUserInfo };