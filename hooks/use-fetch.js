import { useState } from 'react';

const useFetch = (cb) => {
	const [data, setData] = useState(undefined);
	const [loading, setLoading] = useState(null);
	const [error, setError] = useState(null);

	const fn = async (...args) => {
		setLoading(true);
		setError(null);
		try {
			const result = await cb(...args);
			setData(result);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, fn };
};

export default useFetch;
