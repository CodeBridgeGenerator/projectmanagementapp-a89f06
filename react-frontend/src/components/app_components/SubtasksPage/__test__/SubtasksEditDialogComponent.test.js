import React from "react";
import { render, screen } from "@testing-library/react";

import SubtasksEditDialogComponent from "../SubtasksEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders subtasks edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <SubtasksEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("subtasks-edit-dialog-component")).toBeInTheDocument();
});
