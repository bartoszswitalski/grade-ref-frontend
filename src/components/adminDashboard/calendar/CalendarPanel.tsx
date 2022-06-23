import dayjs, { Dayjs } from "dayjs";
import useStore from "../../../zustand/store";
import {useSetState} from "../../../hooks/useSetState";
import {Flex, Grid, IconButton, SimpleGrid, SlideFade, Spacer, Text} from "@chakra-ui/react";
import {CalendarTile} from "./CalendarTile";
import { useEffect } from "react";
import { useCalendar } from "../../../hooks/useCalendar";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {Match} from "../../../entities/Match";
import {getMatchesByDate} from "../../../hooks/shared/matches";

export enum SlideDirection {
  LEFT = -1,
  RIGHT = 1,
}

export enum DayShortNames {
  MON = 'Mon',
  TUE = 'Tue',
  WED = 'Wed',
  THU = 'Thu',
  FRI = 'Fri',
  SAT = 'Sat',
  SUN = 'Sun',
}

interface Props {
  matches: Match[];
  readOnly?: boolean;
}

interface State {
  days: Dayjs[];
  monthOffset: number;
  slideDirection: SlideDirection;
}

export const CalendarPanel = (props: Props) => {
  const setCalendarYear = useStore((state) => state.setCalendarYear);
  const setSelectedDate: (date: Dayjs) => void = useStore((state) => state.setSelectedDate);
  const [state, setState] = useSetState({
    days: [],
    monthOffset: 0,
    slideDirection: SlideDirection.RIGHT,
  } as State);

  const { getCalendarPageDays, getMonthName } = useCalendar();

  useEffect(() => {
    setSelectedDate(dayjs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setState({ days: getCalendarPageDays(state.monthOffset) });
    setCalendarYear(dayjs().add(state.monthOffset, 'month').year());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.monthOffset]);

  return (
    <Flex
      direction={'column'}
      w={['100%', '50%']}
      h={['60vh', '100%']}
      borderRadius={10}
      p={5}
      backgroundColor={'gray.300'}
      shadow={'md'}
    >
      <Flex align={'center'} mb={2}>
        <Spacer />

        <IconButton
          aria-label='left'
          icon={<ArrowBackIcon />}
          onClick={() => {
            setState({ monthOffset: state.monthOffset - 1 });
            setState({ slideDirection: SlideDirection.LEFT });
          }}
        />

        <Flex direction={'column'} w={['50%', '20%']} align={'center'}>
          <SlideFade
            in={true}
            key={state.monthOffset}
            offsetX={20 * state.slideDirection}
            offsetY={0}
            style={{ width: '100%' }}
          >
            <Text fontWeight={'medium'} fontSize={'2xl'} textAlign={'center'}>
              {getMonthName(state.monthOffset)}
            </Text>
          </SlideFade>
          <Text>
            {dayjs().add(state.monthOffset, 'month').year()}
          </Text>
        </Flex>

        <IconButton
          aria-label='left'
          icon={<ArrowForwardIcon />}
          onClick={() => {
            setState({ monthOffset: state.monthOffset + 1 });
            setState({ slideDirection: SlideDirection.RIGHT });
          }}
        />

        <Spacer />
      </Flex>

      <SimpleGrid columns={7} gap={2} mb={2}>
        {Object.values(DayShortNames).map((dayName) => (
          <Flex key={dayName}>
            <Spacer />
            <Text opacity={0.8}>{dayName}</Text>
            <Spacer />
          </Flex>
        ))}
      </SimpleGrid>

      <SlideFade
        in={true}
        key={state.monthOffset}
        offsetX={75 * state.slideDirection}
        offsetY={0}
        style={{ height: '100%', overflow: 'hidden' }}
      >
        <Grid
          templateColumns={'repeat(7, 1fr)'}
          templateRows={'repeat(6, 1fr)'}
          gap={2}
          flexGrow={1}
          overflow={'hidden'}
          h={'100%'}
        >
          {state.days.map((day) => (
            <CalendarTile
              key={day.toString()}
              date={day}
              matches={getMatchesByDate(day, props.matches)}
              monthOffset={state.monthOffset}
            />)
          )}
        </Grid>
      </SlideFade>
    </Flex>
  );
}