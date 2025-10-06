import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 8000,
  withCredentials: true,
});

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

export const getYahooStatus = async () => {
  const { data } = await apiClient.get('/auth/status');
  return data;
};

export const getPlayerMetrics = async () => {
  const { data } = await apiClient.get('/metrics/players');
  return data;
};

export const getPlayerInjuryRisk = async (playerId) => {
  const { data } = await apiClient.get(`/metrics/injury-risk/${encodeURIComponent(playerId)}`);
  return data;
};

