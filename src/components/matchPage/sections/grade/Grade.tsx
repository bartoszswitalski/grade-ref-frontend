import { EditIcon, WarningIcon } from '@chakra-ui/icons';
import { Badge, Button, Flex, HStack, Icon, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { GRADE_ADMISSION_TIME_WINDOW } from 'entities/Match';
import { Constants } from 'utils/Constants';
import { BiBarChartSquare } from 'react-icons/bi';
import { Field } from 'components/matchPage/components/Field';
import { GradeEditModal } from 'components/matchPage/sections/grade/GradeEditModal';
import { useStore } from 'zustandStore/store';
import { Role } from 'utils/Role';
import { SectionHeading } from 'components/matchPage/components/SectionHeading';
import { MatchData } from 'components/matchPage/MatchSectionsPanel';
import { Section } from 'components/matchPage/components/Section';
import { SectionBody } from 'components/matchPage/components/SectionBody';
import { GradeStatus } from 'entities/utils/gradeInfo';
import { MatchInfoEnriched } from 'entities/MatchInfoEnriched';

interface GradeProps {
  match: MatchInfoEnriched;
}

export const Grade = ({ match }: GradeProps) => {
  const user = useStore((state) => state.user);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const getReadableDatetime = (date: Date | undefined, format: string): string => {
    return date ? dayjs(date, Constants.DATETIME_FORMAT).format(format) : 'N/A';
  };

  const refereeGradeDate: string = getReadableDatetime(match.refereeGradeDate, 'DD-MM-YYYY HH:mm');

  const gradeBadge: JSX.Element = (
    <Flex align={'center'}>
      <Badge variant={'outline'} colorScheme={match.gradeStatus.badgeScheme} fontSize={'xl'} w={'auto'}>
        {match.refereeGrade ?? 'N/A'}
      </Badge>
    </Flex>
  );

  const gradeDate: JSX.Element = (
    <Flex gap={2}>
      <Text fontSize={'xl'} fontWeight={'medium'}>
        {refereeGradeDate}
      </Text>
      {match.gradeStatus.delay && (
        <HStack>
          <Tooltip label="delay">
            <Icon as={WarningIcon} color={'red.600'} />
          </Tooltip>
          <Text color={'red.600'}>+{match.gradeStatus.delay}</Text>
        </HStack>
      )}
    </Flex>
  );

  const userIsAdminOrObserver: boolean = user.role === Role.Admin || user.role === Role.Observer;
  const gradeIsPastDue: boolean = dayjs(match.matchDate).add(GRADE_ADMISSION_TIME_WINDOW, 'hour').isBefore(dayjs());
  const gradeIsReceived: boolean = match.gradeStatus.status === GradeStatus.Received;

  const userCanEdit: boolean = userIsAdminOrObserver && (!gradeIsPastDue || !gradeIsReceived);

  return (
    <>
      {userCanEdit && <GradeEditModal isOpen={isEditOpen} handleClose={onEditClose} match={match} />}
      <Section>
        <SectionHeading title={MatchData.Grade} icon={<Icon as={BiBarChartSquare} boxSize={25} />}>
          <Button variant={'ghost'} leftIcon={<Icon as={EditIcon} />} onClick={onEditOpen} disabled={!userCanEdit}>
            Edit
          </Button>
        </SectionHeading>

        <SectionBody>
          <Flex direction={'column'} pr={[0, 20]} gap={2}>
            <Field name={'Grade:'} element={gradeBadge} />
            <Field name={'Grade date:'} element={gradeDate} />
          </Flex>
        </SectionBody>
      </Section>
    </>
  );
};
