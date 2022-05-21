import {Button, Flex, InputLeftElement, InputGroup, Spacer, Text, useDisclosure, Input} from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons';
import {scrollbarStyle} from "../../dashboard/shared/styles";
import {User} from "../../../entities/User";
import {RefereeListItem} from './RefereeListItem';
import {RefereeAddModal} from './RefereeAddModal';
import {useLeagueUsers} from "../../../hooks/useLeagueUsers";
import {Role} from "../../../shared/Role";
import {useSetState} from "../../../hooks/useSetState";
import {userFilter} from "../../shared/filters";
import { useEffect } from 'react';
import { MdSearch } from 'react-icons/md';

interface State {
  referees: User[],
  filter: string,
}

export const RefereesPanel = () => {
  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure();
  const { leagueUsersQuery: refereesQuery } = useLeagueUsers(Role.Referee);

  const [state, setState] = useSetState({
    referees: [],
    filter: '',
  } as State);

  useEffect(() => {
    setState({ referees: refereesQuery.data })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refereesQuery.data]);

  useEffect(() => {
    const filteredReferees: User[] = userFilter(refereesQuery.data!, state.filter);
    setState({ referees: filteredReferees });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filter]);

  return (
    <>
      <RefereeAddModal isOpen={isCreateModalOpen} onClose={onCreateModalClose} />
      <Flex
        direction={'column'}
        borderRadius={10}
        p={5}
        backgroundColor={'gray.300'}
        shadow={'md'}
        overflowY={'hidden'}
        flexGrow={1}
        h={'50%'}
      >
        <Flex mb={4}>
          <Text fontWeight={'bold'} fontSize={'2xl'}>
            Referees
          </Text>
          <Spacer />
          <Button variant={'ghost'} leftIcon={<AddIcon />} onClick={onCreateModalOpen}>
            Add
          </Button>
        </Flex>

        <InputGroup>
          <InputLeftElement
            pointerEvents={'none'}
            children={<MdSearch />}
          />
          <Input
            mb={2}
            placeholder={'Search referee'}
            onChange={(event) => setState({ filter: event.target.value })}
          />
        </InputGroup>

        <Flex direction={'column'} gap={2} overflowY={'scroll'} css={scrollbarStyle}>
          {state.referees.map((referee: User) =>
              <RefereeListItem key={referee.id} referee={referee} />
          )}
        </Flex>
      </Flex>
    </>
  );
}