import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default class Home extends Component {
    render() {
        return (
            <div className="Home">
                <div className="lander">
                    <h1>Página de Inscrições</h1>
                    <h3><p>14ª Edição: início a 20 de Setembro de 2019</p></h3>
                    <h4><p style={{ color: 'red' }}>Prazo limite de inscrições: 6 de Setembro de 2019</p></h4>
                </div>     
<p>Para participar no torneio, as coletividades interessadas terão de inscrever os escalões e respectivos jogadores e equipa técnica 
neste site.<br />
A partir da 13ª edição (2018) as inscrições devem ser feitas exclusivamente através deste site. 
Mantêm-se os requisitos das edições anteriores: é necessário uma <strong>fotografia</strong> e a <strong>folha de inscrição</strong>
&nbsp;(disponível na área de <Link to="/documents">documentos</Link>) com os dados do jogador e assinatura (para jogadores menores 
de 18 anos a assinatura do encarregado de educação).
A fotografia pode ser tirada com um telemóvel (deve ser idêntica a uma fotografia tipo passe) e a folha de inscrição deve ser preenchida 
e posteriormente digitalizada, sendo ambos carregados na página de inscrição de jogador. Para a equipa técnica apenas é necessária a fotografia.</p>

<p>Os escalões disponíveis para inscrição são os seguintes:</p>
<ul>
    <li><strong>Escolinhas</strong> - masculino e feminino, para nascidos entre 21/11/2010 e 31/12/2014 (Dos 5 aos 8 anos);</li>
    <li><strong>I Escalão</strong> - masculino e feminino, para nascidos entre 21/11/2006 e 20/11/2010 (Dos 9 aos 12 anos);</li>
    <li><strong>II Escalão</strong> - masculino para nascidos entre 21-11-2001 a 20-11-2006 (Dos 13 aos 17 anos);</li>
    <li><strong>III Escalão</strong> - masculino para nascidos antes de 20-11-2001 (+ de 17 anos);</li>
    <li><strong>Escalão Feminino</strong> - para nascidas antes de 20-11-2006 (+ de 12 anos).</li>
</ul>

<p>Para mais informações sobre o torneio consulte o 
    <a href="https://drive.google.com/open?id=1HdbvEZwIiopL1azo8i7w75XAQBbyiFAI" target="_blank" rel="noopener noreferrer"> Regulamento Desportivo</a>.</p>
<p>Qualquer problema ou questão relacionada com a página de inscrições, envie um mail para <a href="mailto:courela+tacabarnabe@gmail.com">courela+tacabarnabe@gmail.com</a>.</p>

<p>Acompanhem-nos na página do torneio e também no Facebook e no Twitter.</p>
                <h2>Links</h2>
                <ul>
                    <li><a href="https://tacabarnabe.pt" target="_blank" rel="noopener noreferrer">Página do torneio</a></li>
                    <li><a href="https://www.facebook.com/tacabarnabe" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                    <li><a href="https://twitter.com/tacabarnabe" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                </ul>
            </div>
        );
    }
}
