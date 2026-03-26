import React from 'react';
import Layout from '@theme/Layout';
import ApiPlayground from '../components/ApiPlayground';

export default function PlaygroundPage(): React.ReactElement {
    return (
        <Layout
            title="API Playground"
            description="Authenticate and fire live requests against the Unbound API"
        >
            <ApiPlayground />
        </Layout>
    );
}
