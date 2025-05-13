import React from "react";
import { render, screen } from "@testing-library/react";

import TeamsPage from "../TeamsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders teams page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <TeamsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("teams-datatable")).toBeInTheDocument();
    expect(screen.getByRole("teams-add-button")).toBeInTheDocument();
});
