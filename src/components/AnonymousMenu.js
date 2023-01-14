import Menu, { SubMenu, Item as MenuItem } from 'rc-menu/lib';
import { menuGroupAnimation } from '../utils/animations';

export default function AnonymousMenu(props) {
    var buildTeamsMenuItems = (season, teams) => {
        let menuItems = [];
        teams.forEach(el => {
            menuItems.push(<MenuItem key={"/seasons/" + season + "/teams/" + el.id}>{el.short_description}</MenuItem>);
        });
        return menuItems;
    }

    var teamsMenu = (season, teams) => {
        if (teams.length > 0) {
            return (
                <SubMenu title={<span>Equipas</span>} key="1">
                    {buildTeamsMenuItems(season, teams)}
                </SubMenu>);
        }
        else {
            return (
                <SubMenu title={<span>Equipas</span>} key="1" disabled>
                    {buildTeamsMenuItems(season, teams)}
                </SubMenu>);
        }
    }

    return (
        <Menu onSelect={props.handleSelect} onOpenChange={props.onOpenChange} mode="inline" openAnimation={menuGroupAnimation}>
            {teamsMenu(props.season, props.teams)}
        </Menu>);
}