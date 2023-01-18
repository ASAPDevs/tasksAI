import { useLazyQuery } from "@apollo/client"
import {updateGenerationCooldown} from '../../redux/slices/storageSlice'
import { GET_LAST_GENERATION_NON_NAVIGATION } from "../helpers/queries";
import { useDispatch } from "react-redux";

export const useGetLastGeneration = () => {
  const dispatch = useDispatch();

  const [fetch, {refetch}] = useLazyQuery(GET_LAST_GENERATION_NON_NAVIGATION, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log("Completed fetching last generation time1: ", data)
      dispatch(updateGenerationCooldown({lastgeneration: data.getLastGeneration}))
    }
  })

  return {fetch}
}