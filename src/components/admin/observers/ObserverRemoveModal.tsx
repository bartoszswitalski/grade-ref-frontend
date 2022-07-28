import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { User } from 'entities/User';
import { observerItem } from 'components/admin/observers/ObserverListItem';
import { useLeagueUsers } from 'hooks/useLeagueUsers';
import { Role } from 'utils/Role';
import { useEffect } from 'react';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  observer: User;
}

export const ObserverRemoveModal = (props: Props) => {
  const { removeMutation } = useLeagueUsers(Role.Observer);

  const deleteObserver = () => {
    removeMutation.mutate(props.observer.id);
  };

  useEffect(() => {
    if (removeMutation.isSuccess) {
      props.onClose();
    }
  }, [removeMutation.isSuccess]);

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove observer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold" mb="1rem">
              Are you sure you want to remove the following observer from this league?
            </Text>
            <Flex p={5} borderRadius={10} alignItems={'center'} backgroundColor={'gray.50'}>
              {observerItem(props.observer)}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button colorScheme="red" onClick={deleteObserver} isLoading={removeMutation.isLoading} ml={3}>
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
