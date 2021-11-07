/**
 * Fields in a request to update a single todo item.
 */
export interface UpdateTodoRequestPayload {
  name: string
  dueDate: string
  done: boolean
}
