import { useToast } from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { Dayjs } from "dayjs";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {Match} from "entities/Match";
import {uuid} from "utils/uuid";
import {getMatchesByDate} from "./utils/matches";
import {toastError} from "./utils/toastError";
import {enrichMatch} from "entities/utils/matchStatus";

export const MATCHES_QUERY_KEY = 'matches_qk';

export interface Props {
  enableAutoRefetch?: boolean;
  leagueId?: uuid;
}

export const useLeagueMatches = (props?: Props) => {
  const toast = useToast();
  const queryClient: QueryClient = useQueryClient();
  let { leagueId } = useParams<{ leagueId: uuid }>();
  leagueId = props ? props.leagueId ?? leagueId : leagueId;

  const getMatches = async (): Promise<Match[]> => {
    const response = await axios.get(`leagues/${leagueId}/matches`);
    return response.data.map((match: Match) => enrichMatch(match));
  }

  const postMatch = async (match: Match): Promise<Match> => {
    const response = await axios.post(`leagues/${leagueId}/matches`, match);
    return enrichMatch(response.data);
  }

  const updateMatch = async (match: Match): Promise<Match> => {
    const response = await axios.put(`leagues/${leagueId}/matches/${match.id}`, match);
    return enrichMatch(response.data);
  }

  const deleteMatch = async (matchId: uuid): Promise<Match> => {
    const response = await axios.delete(`leagues/${leagueId}/matches/${matchId}`);
    return response.data;
  }

  const query = useQuery(
    [MATCHES_QUERY_KEY, leagueId],
    getMatches,
    { enabled: props ? !!props.enableAutoRefetch : false },
  );

  const postMutation = useMutation(postMatch, {
    onSuccess: (match: Match) => {
      queryClient.setQueryData([MATCHES_QUERY_KEY, leagueId], (old: any) => [...old, match]);
      toast({
        title: 'Successfully added a match',
        status: 'success',
        position: 'bottom-right',
        duration: 2000,
      });
    },
    onError: (error: AxiosError, _variables, _context) => toastError(toast, error),
  });

  const updateMutation = useMutation(updateMatch, {
    onSuccess: (match: Match) => {
      queryClient.setQueryData([MATCHES_QUERY_KEY, leagueId], (old: any) => [...old.filter((m: Match) => m.id !== match.id), match]);
      toast({
        title: 'Successfully updated a match',
        status: 'success',
        position: 'bottom-right',
        duration: 2000,
      });
    },
    onError: (error: AxiosError, _variables, _context) => toastError(toast, error),
  });

  const deleteMutation = useMutation(deleteMatch, {
    onSuccess: (match: Match) => {
      queryClient.setQueryData([MATCHES_QUERY_KEY, leagueId], (old: any) => old.filter((m: Match) => m.id !== match.id));
      toast({
        title: 'Successfully deleted a match',
        status: 'success',
        position: 'bottom-right',
        duration: 2000,
      });
    },
    onError: (error: AxiosError, _variables, _context) => toastError(toast, error),
  });

  const getByDate = (date: Dayjs) => {
    return getMatchesByDate(date, query.data);
  }

  return { query, postMutation, updateMutation, deleteMutation, getByDate };
}
