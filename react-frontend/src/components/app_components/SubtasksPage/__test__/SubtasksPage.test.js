import React from "react";
import { render, screen } from "@testing-library/react";

import SubtasksPage from "../SubtasksPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders subtasks page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <SubtasksPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("subtasks-datatable")).toBeInTheDocument();
    expect(screen.getByRole("subtasks-add-button")).toBeInTheDocument();
});
