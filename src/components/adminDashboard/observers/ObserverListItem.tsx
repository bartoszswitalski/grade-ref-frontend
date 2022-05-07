import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Flex, Spacer, IconButton, VStack, Text, useDisclosure, Avatar, HStack, Badge } from '@chakra-ui/react';
import {User} from "../../../entities/User";
import { ObserverDeleteModal } from './ObserverDeleteModal';
import { ObserverEditModal } from './ObserverEditModal';

export interface Props {
  observer: User;
}

export const ObserverListItem = (props: Props) => {
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();

  return (
    <>
      <ObserverEditModal isOpen={isEditModalOpen} onClose={onEditModalClose} observer={props.observer} />
      <ObserverDeleteModal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} observer={props.observer} />
      <Flex
        p={5}
        borderRadius={10}
        alignItems={'center'}
        backgroundColor={'gray.50'}
        cursor={'pointer'}
      >
        {observerItem(props.observer)}
        <Spacer />
        <IconButton onClick={onEditModalOpen} variant={'ghost'} aria-label='Edit observer' icon={<EditIcon />} />
        <IconButton onClick={onDeleteModalOpen} variant={'ghost'} aria-label='Delete observer' icon={<DeleteIcon />} />
      </Flex>
    </>
  );
}

export const observerItem = (user: User,
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
            {showBadge && <Badge colorScheme='purple' fontSize={'xs'}>Observer</Badge>}
          </HStack>
          <Text fontSize={descriptionSize ?? 'sm'} color={'gray.400'}>
            {user.email}, {user.phoneNumber}
          </Text>
        </VStack>
      </HStack>
    </>
  )
}