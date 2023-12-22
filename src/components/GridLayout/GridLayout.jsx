import React, { useEffect } from 'react';

import Property from '../Property/Property';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPaginatedProperties } from '../../http/properties';
import ShimmerGrid from '../ShimmerGrid/ShimmerGrid';
import { Button } from 'antd';
import { useInView } from 'react-intersection-observer';

function GridLayout({ id }) {
  const { ref, inView } = useInView();

  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['getPropertiesByCategories'],
    queryFn: ({ pageParam = 1 }) => {
      return getPaginatedProperties({
        pageNum: pageParam,
        propertyTypeFilter: id,
        statusFilter: 'ACTIVE',
      });
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.data?.meta?.pageNum + 1 <=
        lastPage?.data?.meta?.totalPages
        ? lastPage?.data?.meta?.pageNum + 1
        : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (status === 'loading') {
    return <ShimmerGrid />;
  } else if (status === 'error') {
    return message.error(error.message);
  } else {
    const properties = data?.pages.map((page) => {
      return page?.data?.records?.map((r) => r);
    });

    return (
      <div className={''}>
        <div className="w-full grid max-[3000px]:grid-cols-6 max-[2000px]:grid-cols-5 max-[1200px]:grid-cols-3 max-[1000px]:grid-cols-2 max-[500px]:grid-cols-1">
          {data?.pages.map((page) =>
            page.data.records?.map((record, idx) => {
              if (page.data.records?.length === idx + 1) {
                return (
                  <Property
                    innerRef={ref}
                    key={record?.id}
                    property={record}
                    className="w-max"
                  />
                );
              }
              return (
                <Property
                  key={record?.id}
                  property={record}
                  className="w-max"
                />
              );
            })
          )}
          {/* <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage}
            ref={ref}
          >
            Load More...
          </button> */}
        </div>
        {isFetchingNextPage && <ShimmerGrid />}
      </div>
    );
  }
}

export default GridLayout;
