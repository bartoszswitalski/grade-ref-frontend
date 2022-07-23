import { DeleteIcon } from '@chakra-ui/icons';
import { Flex, Spacer, IconButton, VStack, Text, useDisclosure, Avatar, HStack, Badge } from '@chakra-ui/react';
import { MdAssessment } from 'react-icons/md';
import {User} from "entities/User";
import { RefereeRemoveModal } from 'components/admin/referees/RefereeRemoveModal';
import {RefereeGradesModal} from "components/admin/referees/RefereeGradesModal";
import { useUserMatches } from 'hooks/useUserMatches';

export interface Props {
  referee: User;
}

export const RefereeListItem = (props: Props) => {
  const { query: matchesQuery } = useUserMatches({ userId: props.referee.id });
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const { isOpen: isGradesModalOpen, onOpen: onGradesModalOpen, onClose: onGradesModalClose } = useDisclosure();

  const handleOpenGradesModal = async () => {
    await matchesQuery.refetch();
    onGradesModalOpen();
  }

  return (
    <>
      <RefereeRemoveModal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} referee={props.referee} />
      <RefereeGradesModal isOpen={isGradesModalOpen} onClose={onGradesModalClose} referee={props.referee} />
      <Flex
        p={3}
        borderRadius={10}
        alignItems={'center'}
        backgroundColor={'gray.50'}
      >
        {refereeItem(props.referee)}
        <Spacer />
        <IconButton
          onClick={handleOpenGradesModal}
          variant={'ghost'}
          aria-label='See grades'
          icon={<MdAssessment />}
          isLoading={matchesQuery.isLoading}
        />
        <IconButton onClick={onDeleteModalOpen} variant={'ghost'} aria-label='Delete referee' icon={<DeleteIcon />} />
      </Flex>
    </>
  );
}

export const refereeItem = (user: User,
                            avatarSize?: string,
                            nameSize?: string,
                            descriptionSize?: string,
                            showBadge?: boolean) => {
  return (
    <>
      <HStack>
        <Avatar
          name={user.firstName + ' ' + user.lastName}
          size={avatarSize ?? 'sm'}
        />
        <VStack spacing={0} alignItems={'baseline'}>
          <HStack>
            <Text fontSize={nameSize ?? 'md'}>{user.firstName} {user.lastName}</Text>
            {showBadge && <Badge colorScheme='facebook' fontSize={'xs'}>Referee</Badge>}
          </HStack>
          <VStack alignItems={'baseline'} spacing={0}>
            <Text fontSize={descriptionSize ?? 'sm'} color={'gray.400'}>
              {user.email}
            </Text>
            <Text fontSize={descriptionSize ?? 'sm'} color={'gray.400'}>
              {user.phoneNumber}
            </Text>
          </VStack>
        </VStack>
      </HStack>
    </>
  )
}