import * as React from "react";

import {
    Alignment,
    Button,
    Classes,
    // H5,
    Navbar,
    // NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Popover,
    Position,
    Menu,
    MenuItem,
    MenuDivider,
    // Switch,
} from "@blueprintjs/core";

const menu = (props = {}) => {
    return (
        <Menu className={props.className}>
            <MenuItem text="New" icon="document" {...props} />
            <MenuItem text="Open" icon="folder-shared" {...props} />
            <MenuItem text="Close" icon="add-to-folder" {...props} />
            <MenuDivider />
            <MenuItem text="Save" icon="floppy-disk" {...props} />
            <MenuItem text="Save as..." icon="floppy-disk" {...props} />
            <MenuDivider />
            <MenuItem text="Exit" icon="cross" {...props} />
        </Menu>
    )
};

export class Header extends React.Component {
    render() {
        return (
            <Navbar>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>nXTrade</NavbarHeading>
                    <Button className={Classes.MINIMAL} icon="home" text="Dashboard" />
                    <Button className={Classes.MINIMAL} icon="document" text="Watchlist" />
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Popover content={menu()} position={Position.BOTTOM} minimal={true}>
                        <Button className={Classes.MINIMAL} icon="user" rightIcon="caret-down" text="Profile settings" />
                    </Popover>
                    <Button className={Classes.MINIMAL} icon="settings" />
                </NavbarGroup>
            </Navbar>
        );
    }
}
