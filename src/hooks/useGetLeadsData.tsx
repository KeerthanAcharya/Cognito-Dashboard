import { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { leadListApi } from '../controllers/leads';

export type UserList = {
    _id: string;
    first_name: string;
    last_name: string;
};

export const useGetLeadsData = (
    page: number,
    limit: number,
    enableQuery: boolean = true,
    usersData: any,
    filterQuery: any
) => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery(
        ['leads', page, limit, filterQuery],
        () =>
            leadListApi('', {
                page,
                limit,
                filterQuery,
            }),
        {
            keepPreviousData: true,
            staleTime: 120000,
            enabled: enableQuery,
            select(data) {
                const res = data?.body
                    ? data.body.map((_data: { owner: any }) => {
                          const ownerName = usersData.body.user_detail.find(
                              (user: { _id: string }) => user._id === _data.owner
                          );
                          return {
                              ..._data,
                              owner_name: ownerName
                                  ? ownerName.first_name + ' ' + ownerName.last_name
                                  : '',
                          };
                      })
                    : null;
                return {
                    ...data,
                    body: res,
                };
            },
        }
    );

    useEffect(() => {
        if (data && data.config.hasMore) {
            const nextPage = page + 1;
            queryClient.prefetchQuery(['leads', nextPage, limit, filterQuery], () =>
                leadListApi('', { page: nextPage, limit, filterQuery })
            );
        }
    }, [queryClient, page, data, limit, filterQuery]);

    return { data, isLoading };
};
