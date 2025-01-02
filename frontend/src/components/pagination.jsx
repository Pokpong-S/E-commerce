import React from 'react';
import { HStack, Button, Text } from '@chakra-ui/react';

const Pagination = ({ currentPage, totalPages, onPrevious, onNext }) => {
  return (
    <HStack justifyContent="center" mt={4}>
      {currentPage > 1 && (
        <Button onClick={onPrevious}>
          Previous
        </Button>
      )}
      <Text>
        Page {currentPage} of {totalPages}
      </Text>
      {currentPage < totalPages && (
        <Button onClick={onNext}>
          Next
        </Button>
      )}
    </HStack>
  );
};

export default Pagination;
