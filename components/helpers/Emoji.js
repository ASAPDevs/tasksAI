import React from 'react';
import { Text } from 'native-base';

const Emoji = React.memo(({ symbol }) =>
    <Text role="img">
        {String.fromCodePoint(symbol)}
    </Text>)


export default Emoji