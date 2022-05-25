import {useToast} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import {QueryClient, useMutation, useQuery, useQueryClient} from "react-query";
import {uuid} from "../shared/uuid";
import {User} from "../entities/User";
import {Role} from "../shared/Role";
import { useParams } from "react-router-dom";
import {toastError} from "./shared/toastError";

const REFEREES_QUERY_KEY = 'referees_qk';
const OBSERVERS_QUERY_KEY = 'observers_qk'

export interface Props {
  disableAutoRefetch: boolean;
  leagueId: uuid;
}

export const useLeagueUsers = (role: Role, props?: Props) => {
  const toast = useToast();
  const queryClient: QueryClient = useQueryClient();
  let { leagueId } = useParams<{ leagueId: uuid }>();
  leagueId = props ? props.leagueId : leagueId;

  const usersTypes: string = role === Role.Referee ? 'referees' : 'observers';

  const getAllUsers = async (): Promise<User[]> => {
    const response = await axios.get(`users/${usersTypes}`);
    return response.data;
  }

  const getAssignedUsers = async (): Promise<User[]> => {
    const response = await axios.get(`leagues/${leagueId}/${usersTypes}`);
    return response.data;
  }

  const assignUserToLeague = async (user: User): Promise<User> => {
    const response = await axios.post(`leagues/${leagueId}/${usersTypes}/${user.id}`, user);
    return response.data;
  }

  const unassignUserFromLeague = async (userId: uuid): Promise<User> => {
    const response = await axios.delete(`leagues/${leagueId}/${usersTypes}/${userId}`);
    return response.data;
  }

  const usersQuery = useQuery(
    role === Role.Referee ? REFEREES_QUERY_KEY : OBSERVERS_QUERY_KEY,
    getAllUsers,
    { enabled: props ? !props.disableAutoRefetch : true },
  );

  const leagueUsersQuery = useQuery(
    [role === Role.Referee ? REFEREES_QUERY_KEY : OBSERVERS_QUERY_KEY, leagueId],
    getAssignedUsers,
    { enabled: props ? !props.disableAutoRefetch : true },
  );

  const addMutation = useMutation(assignUserToLeague, {
    onSuccess: (user: User) => {
      const queryKey: any = user.role === Role.Referee ? REFEREES_QUERY_KEY : OBSERVERS_QUERY_KEY;
      queryClient.setQueryData([queryKey, leagueId], (old: any) => [...old, user]);

      toast({
        title: `Successfully added ${user.role}`,
        status: 'success',
        position: 'bottom-right',
        duration: 2000,
      });
    },
    onError: (error: AxiosError, _variables, _context) => toastError(toast, error),
  });

  const removeMutation = useMutation(unassignUserFromLeague, {
    onSuccess: (user: User) => {
      const queryKey: any = user.role === Role.Referee ? REFEREES_QUERY_KEY : OBSERVERS_QUERY_KEY;
      queryClient.setQueryData([queryKey, leagueId], (old: any) => old.filter((u: User) => u.id !== user.id));

      toast({
        title: `Successfully deleted ${user.role}`,
        status: 'success',
        position: 'bottom-right',
        duration: 2000,
      });
    },
  });

  return { usersQuery, leagueUsersQuery, addMutation, removeMutation }
}