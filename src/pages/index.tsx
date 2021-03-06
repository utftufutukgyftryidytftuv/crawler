import type {NextPage} from 'next';
import Input from '../components/input';
import {useFfw, useInitFfw} from 'ffw';
import * as yup from 'yup';
import {Button} from 'baseui/button';
import {getLinks} from '../conections/crawler';
import {useState} from 'react';
import {ListItem, ListItemLabel} from 'baseui/list';
import {Check, Search} from 'baseui/icon';
import Show from '../components/show';
import {DisplayXSmall} from 'baseui/typography';
import {Spinner} from 'baseui/icon';
import Links from '../components/links';

const Home: NextPage = () => {
  const [links, setLinks] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [finishTime, setFinishTime] = useState('');
  const ffw = useInitFfw({
    initValues: {
      url: 'https://google.com',
      maxDepth: 2,
      maxRequests: 30,
    },
    validateSchema: yup
      .object({
        url: yup.string().url().required(),
        maxDepth: yup.number().max(2).required(),
        maxRequests: yup.number().max(40).required(),
      })
      .required(),
    async onSubmit(ffw) {
      setStartTime(new Date().toISOString());
      setFinishTime('');
      setLinks([]);
      const links = await getLinks(
        encodeURIComponent(ffw.f.url.value),
        ffw.f.maxDepth.value,
        ffw.f.maxRequests.value
      );
      setFinishTime(new Date().toISOString());
      setLinks(links);
    },
  });
  useFfw({
    form: ffw,
  });
  return (
    <div className={'flex justify-center'}>
      <div className={'grow max-w-md p-6 flex flex-col'}>
        <Input
          label={{label: 'Url', error: ffw.f.url.error}}
          input={{...ffw.f.url.getInput()}}
        />
        <Input
          className={'mt-8'}
          label={{label: 'Max depth', error: ffw.f.maxDepth.error}}
          input={{...ffw.f.maxDepth.getInput()}}
        />
        <Input
          className={'mt-8'}
          label={{label: 'Max requests', error: ffw.f.maxRequests.error, caption: 'At the same time'}}
          input={{...ffw.f.maxRequests.getInput()}}
        />
        <Button className={'mt-8'} onClick={ffw.submit}>
          Go
        </Button>
        <Show show={startTime && !finishTime}>
          <Spinner size={50} className={'animate-spin self-center mt-16'} />
        </Show>
        <Show show={links.length}>
          <div className={'pt-16 flex flex-col gap-2'}>
            <DisplayXSmall className={'self-center'}>Links</DisplayXSmall>
            <div>Count {links.length}</div>
            <div>Start time: {startTime}</div>
            <div>Finish time: {finishTime}</div>
            <Links links={links} />
          </div>
        </Show>
      </div>
    </div>
  );
};

export default Home;
