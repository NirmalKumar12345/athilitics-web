export const getBaseURL = async (): Promise<string> => {
  // Replace with your logic to get the base URL
  return process.env.BACKEND_API_URL || '';
};
