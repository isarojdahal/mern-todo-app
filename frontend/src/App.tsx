import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "./components/ui/use-toast";
import { Trash, Pencil } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import UpdateTodo from "./components/custom/UpdateTodo";

const App = () => {
  // Hooks
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation
  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["todos"],
    mutationFn: (data) => {
      console.log("data", data);
      return axios.post(`${import.meta.env.VITE_API_URL}/todo`, data);
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Todo Added",
        description: "Add more Todos more more reminder",
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ["todoList"] });
    },
  });

  const { mutate: deleteTodoMutation } = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: (id) => {
      return axios.delete(`${import.meta.env.VITE_API_URL}/todo/${id}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoList"] });
      toast({
        variant: "success",
        title: "Todo Deleted",
        description: "Add more Todos more more reminder",
      });
    },
  });

  const { mutate: updateTodoCompletion } = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: (data: { id: string; completedStatus: boolean }) => {
      return axios.put(`${import.meta.env.VITE_API_URL}/todo/${data.id}`, {
        data: { completed: data.completedStatus },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoList"] });
      toast({
        variant: "success",
        title: "Todo Status Updated",
      });
    },
  });

  // Query
  const { data, isLoading } = useQuery({
    queryKey: ["todoList"],
    queryFn: () => {
      return axios.get(`${import.meta.env.VITE_API_URL}/todo`);
    },
  });

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          console.log("data", data);
          mutate(data);
        })}
        className="p-10 d-flex justify-start"
        title="Add Todo Form"
      >
        <h4 className="text-3xl font-bold mb-4">Add List</h4>

        <Label htmlFor="todoTitle">Title</Label>
        <Input id="todoTitle" {...register("data.title")} />

        <div className="mt-5"></div>
        <Label htmlFor="todoDescription">Description</Label>
        <Textarea id="todoDescription" {...register("data.description")} />

        <Button type="submit" className="mt-5">
          {isPending ? "Adding Todo.." : "Add Todo"}
        </Button>
      </form>
      <hr />
      <h4 className="text-3xl font-bold p-4">Todo List</h4>
      {isLoading && "Loading Todo.."}
      {data &&
        data.data.data.map((d) => {
          return (
            <div className="mb-5 p-4 shadow flex justify-between">
              <div
                className={`cursor-pointer ${
                  d.completed ? "line-through" : ""
                }`}
                onClick={() => {
                  updateTodoCompletion({
                    id: d.id,
                    completedStatus: !d.completed,
                  });
                }}
              >
                {d.title}
                <br />
                {d.description}
              </div>
              <div>
                <UpdateTodo
                  title={d.title}
                  description={d.description}
                  id={d.id}
                />

                <Dialog>
                  <DialogTrigger asChild>
                    <Trash color={"red"} />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Do you want to delete ? </DialogTitle>
                      <DialogDescription>
                        Are you sure to do the action ?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => deleteTodoMutation(d.id)}
                        >
                          Yes
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          No
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default App;
