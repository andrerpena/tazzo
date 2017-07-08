import * as React from 'react';
import * as commonTypes from '../../common/typings';

import { ProfileCard } from './ProfileCard';

interface ISearchResultProps {
    profiles: commonTypes.ReduxUserProfile[];
}

const SearchResult: React.SFC<ISearchResultProps> = ({ profiles }) => (
    <ul className="search-result">
        {profiles.map((p, i) => <ProfileCard key={i} profile={p} />)}
    </ul>
);

export { SearchResult };
