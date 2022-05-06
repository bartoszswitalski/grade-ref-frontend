import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import {Match} from "../entities/Match";
import {uuid} from "../other/uuid";

const MATCHES_QUERY_KEY = 'matches_qk';

export const useMatches = () => {
  const toast = useToast();
  const queryClient: QueryClient = useQueryClient();

  const getMatches = async (): Promise<Match[]> => {
    const response = await axios.get(`matches`);
    return response.data;
  }

  const postMatch = async (match: Match) => {
    const response = await axios.post(`matches`, match);
    return response.data;
  }

  const updateMatch = async (match: Match) => {
    const response = await axios.put(`matches/${match.id}`, match);
    return response.data;
  }

  const deleteMatch = async (matchId: uuid) => {
    const response = await axios.delete(`matches/${matchId}`);
    return response.data;
  }

  const query = useQuery(MATCHES_QUERY_KEY, getMatches);

  const postMutation = useMutation(postMatch, {
    onSuccess: (match: Match) => {
      queryClient.setQueryData(MATCHES_QUERY_KEY, (old: any) => [...old, match]);
      toast({
        title: 'Successfully added a match',
        status: 'success',
        position: 'bottom-right',
        duration: 2000,
      });
    },
  });

  const updateMutation = useMutation(updateMatch, {
    onSuccess: (match: Match) => {
      const matches: Match[] = queryClient.getQueryData(MATCHES_QUERY_KEY)!;
      const index: number = matches.findIndex((m: Match) => m.id === match.id);
      matches[index] = match;
      queryClient.setQueryData(MATCHES_QUERY_KEY, (_) => matches);
      toast({
        title: 'Successfully updated a match',
        status: 'success',
        position: 'bottom-right',
        duration: 2000,
      });
    },
  });

  const deleteMutation = useMutation(deleteMatch, {
    onSuccess: (match: Match) => {
      queryClient.setQueryData(MATCHES_QUERY_KEY, (old: any) => old.filter((m: Match) => m.id !== match.id));
      toast({
        title: 'Successfully deleted a match',
        status: 'success',
        position: 'bottom-right',
        duration: 2000,
      });
    },
  });

  return { query, postMutation, updateMutation, deleteMutation }
}