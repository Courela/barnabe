import { NavDropdown, MenuItem, Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { NavLink } from "react-router-dom";

export default function SeasonDropDown(props) {
    let seasons = [];
    if (props.seasons.length > 0) {
        const activeSeason = props.seasons.find(s => s.is_active);
        const indexActive = props.seasons.indexOf(activeSeason);

        seasons = props.seasons.map(s => s.year);
        seasons.splice(indexActive, 1);
        seasons.splice(0, 0, activeSeason.year, 0);
    }

    return (
        <NavDropdown id="season-nav-dropdown" title="Edição">
            {seasons.map((s, idx) => {
                return (s > 0 ? 
                    //<NavLink key={idx} to={'/seasons/' + s}>{s}</NavLink> :
                    // <NavDropdown.Item onSelect={props.onSeasonChange(s)}>{s}</NavDropdown.Item> :
                    <LinkContainer key={idx} to={'/seasons/' + s}><NavItem>{s}</NavItem></LinkContainer> : 
                    <MenuItem key={idx} divider />
                );
            })}
        </NavDropdown>);
}