import { CloseIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Link, Spacer, Text } from '@chakra-ui/react';
import axios from 'axios';
import { ReportType, useReports } from 'hooks/useReports';
import { useSetState } from 'hooks/useSetState';
import { useEffect } from 'react';
import { MdFileDownload } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { uuid } from 'utils/uuid';

interface DownloadableReportProps {
  reportType: ReportType;
  hasWritePermissions: boolean;
}

interface State {
  url: string;
  fileName: string;
}

export const DownloadableReport = ({ reportType, hasWritePermissions }: DownloadableReportProps) => {
  const [state, setState] = useSetState({
    url: '',
    fileName: '',
  } as State);
  const { leagueId } = useParams<{ leagueId: uuid }>();
  const { matchId } = useParams<{ matchId: uuid }>();

  const { deleteMutation } = useReports();

  useEffect(() => {
    getFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteReport = () => {
    deleteMutation.mutate(reportType);
  };

  const getFile = async () => {
    const response = await axios.get(`leagues/${leagueId}/matches/${matchId}/reports/${reportType}`, {
      responseType: 'blob',
    });

    const header = response.headers['content-disposition'];
    const fileName = header.split('/').at(-1)?.slice(0, -1).replace(/:/g, '.');

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const urlTemp = URL.createObjectURL(blob);

    setState({ url: urlTemp, fileName });
  };

  return (
    <Flex
      w={'100%'}
      direction={'column'}
      backgroundColor={'gray.100'}
      p={5}
      borderRadius={10}
      borderWidth={2}
      borderColor={'gray.400'}
      h={'100%'}
      align={'center'}
      position={'relative'}
    >
      {hasWritePermissions && (
        <IconButton
          onClick={deleteReport}
          size={'sm'}
          aria-label="Delete"
          icon={<CloseIcon />}
          position={'absolute'}
          top={2}
          right={2}
          isLoading={deleteMutation.isLoading}
        />
      )}

      <Spacer />
      <IconButton
        as={Link}
        href={state.url}
        download={state.fileName}
        aria-label="Download"
        icon={<MdFileDownload size={'40'} />}
        opacity={0.6}
      />
      <Text>Download</Text>
      <Spacer />
    </Flex>
  );
};
