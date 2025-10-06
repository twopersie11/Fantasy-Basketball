import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 8000,
});

export const getTeams = async () => {
  const { data } = await apiClient.get('/teams');
  return data;
};

export const getTeamDetails = async (teamName) => {
  const { data } = await apiClient.get(`/teams/${encodeURIComponent(teamName)}`);
  return data;
};

export const getMatchup = async (teamOne, teamTwo) => {
  const { data } = await apiClient.get(
    `/matchups/${encodeURIComponent(teamOne)}/${encodeURIComponent(teamTwo)}`,
  );
  return data;
};

export const getFantasyOptions = async () => {
  const { data } = await apiClient.get('/fantasy/options');
  return data;
};

export const getFantasyAdvice = async (optionId) => {
  const { data } = await apiClient.get('/fantasy', {
    params: { option: optionId },
  });
  return data;
};

