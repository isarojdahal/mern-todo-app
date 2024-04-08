import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { userQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";

const UpdateTodo = ({
  title,
  description,
  id,
}: {
  title: string;
  description: string;
  id: string;
}) => {
  // forms
  const { register, handleSubmit } = useForm({
    values: {
      data: {
        title,
        description,
      },
    },
  });

  const client = useQueryClient();
  const { toast } = useToast();
  // Mutation

  const { mutate: updateTodoMutation } = useMutation({
    mutationKey: ["updateTodo", id],
    mutationFn: (data) => {
      console.log("data", data);
      return axios.put(`${import.meta.env.VITE_API_URL}/todo/${id}`, data);
    },
    onSuccess: () => {
      console.log("updated");
      toast({
        variant: "success",
        title: "Todo Updated",
      });
      client.invalidateQueries({ queryKey: ["todoList"] });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pencil color={"green"} className="mb-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Todo </DialogTitle>
          <DialogDescription>
            <form
              onSubmit={handleSubmit((data) => {
                console.log("data", data);
                updateTodoMutation(data);
              })}
            >
              <Label>Title </Label>
              <Input {...register("data.title")} />
              <Label>Description</Label>
              <Textarea {...register("data.description")} />
              <DialogClose asChild>
                <Button type="submit" variant="secondary">
                  Update
                </Button>
              </DialogClose>
            </form>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {/* <Button type="submit" variant="secondary">
              Update
            </Button> */}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTodo;
