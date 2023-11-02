import LocalizedStrings from 'react-localization';

export default new LocalizedStrings({
    en:{
        ERR_000: 'Unexpected error!',
        ERR_001: 'Duplicated match',
        ERR_002: 'Season %s: no step with id %s found for team with id %s',
    },
    pt:{
        ERR_000: 'Ocorreu um erro, tente outra vez mais tarde. Se o erro persistir contacte o administrador.',
        ERR_001: 'Jogo já existe.',
        ERR_002: 'Época %s: %s inexistente para a equipa %s',
    }
});