import { useQuery } from "@tanstack/react-query";
import { getList } from "../Provieder";


export const useList = ({ resource = "products" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getList({ resource }),
  });
};