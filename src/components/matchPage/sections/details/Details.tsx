import { EditIcon, InfoIcon } from "@chakra-ui/icons";
import { Button, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import dayjs from "dayjs";
import { Match } from "entities/Match";
import { Team } from "entities/Team";
import { Constants } from "utils/Constants";
import { DetailsEditModal } from "components/matchPage/sections/details/DetailsEditModal";
import { TextField } from "components/matchPage/components/TextField";
import { Role } from "utils/Role";
import { useStore } from "zustandStore/store";
import { SectionHeading } from "components/matchPage/components/SectionHeading";
import { MatchData } from "components/matchPage/MatchSectionsPanel";

interface DetailsProps {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
}

export const Details = ({ match, homeTeam, awayTeam }: DetailsProps) => {
  const user = useStore((state) => state.user);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const getReadableDatetime = (date: Date, format: string): string => {
    return date ? dayjs(date, Constants.DATETIME_FORMAT).format(format) : 'N/A';
  }

  const matchDate: string = getReadableDatetime(match.matchDate, 'DD-MM-YYYY');
  const matchTime: string = getReadableDatetime(match.matchDate, 'HH:mm');

  const matchHasStarted: boolean = dayjs(match.matchDate).isBefore(dayjs());
  const userIsAdmin: boolean = user.role === Role.Admin;
  const userCanEdit: boolean = userIsAdmin && !matchHasStarted;

  return (
    <>
      {userCanEdit && <DetailsEditModal isOpen={isEditOpen} handleClose={onEditClose} match={match} />}

      <Flex direction={'column'} w={'100%'} mb={5} gap={2}>
        <SectionHeading title={MatchData.Details} icon={<InfoIcon boxSize={25} />}>
          <Button
            variant={'ghost'}
            leftIcon={<Icon as={EditIcon} />}
            onClick={onEditOpen}
            disabled={!userCanEdit}
          >
            Edit
          </Button>
        </SectionHeading>

        <Flex
          direction={'column'}
          w={'100%'}
          borderRadius={10}
          backgroundColor={'gray.200'}
          p={5}
        >
          <Flex direction={'column'} pr={[0, 20]} gap={2}>
            <TextField name={'Date:'} text={matchDate} />
            <TextField name={'Time:'} text={matchTime} />
            <TextField name={'Stadium:'} text={match.stadium} />
            <TextField name={'Home team:'} text={homeTeam.name} />
            <TextField name={'Away team:'} text={awayTeam.name} />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
