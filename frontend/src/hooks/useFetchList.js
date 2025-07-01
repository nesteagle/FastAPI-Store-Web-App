import { useState, useEffect } from "react";
import { useApi } from "./useApi";

export default function useFetchList(fetchFunction, dataKey) {
  const { callApi } = useApi();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await callApi(fetchFunction.endpoint, fetchFunction.method, fetchFunction.data);
        setData(response[dataKey]);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [callApi, fetchFunction, dataKey]);

  return { data, isLoading, error };
}