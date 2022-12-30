import useSWR from "swr"

// const fetcher = (...args) => fetch(...args).then(res => res.json())

export const useProducts = ( url, config = {} ) => {

    // const { data, error } = useSWR(`/api${ url }`, fetcher, config);
    const { data, error } = useSWR(`/api${ url }`, config);

    return {
        products: data || [],
        isLoading: !error && !data,
        isError: error
    }
}