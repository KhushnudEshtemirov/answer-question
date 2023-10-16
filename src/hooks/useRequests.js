import { useMutation } from "react-query";
import { toast } from "react-toastify";

const useRequests = ({ url, refetch, refetchQuestions = refetch }) => {
  // Post mutation
  const { mutate: addMutate } = useMutation(async (data) => await url(data), {
    onSuccess: () => {
      refetch();
      toast.success("Muvaffaqiyatli qo'shildi.");
    },
    onError: () => {
      toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    },
  });

  // Update mutation
  const { mutate: updateMutate } = useMutation(
    async (data) => await url(data),
    {
      onSuccess: () => {
        refetch();
        toast.success("Muvaffaqiyatli yangilandi.");
      },
      onError: () => {
        toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
      },
    }
  );

  // Delete mutation
  const { mutate: deleteMutate } = useMutation(async (id) => await url(id), {
    onSuccess: () => {
      refetch();
      refetchQuestions();
      toast.success("Muvaffaqiyatli o'chirildi.");
    },
    onError: () => {
      toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    },
  });

  return { addMutate, updateMutate, deleteMutate };
};

export default useRequests;
