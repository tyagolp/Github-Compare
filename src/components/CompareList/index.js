import React from 'react';
import PropTypes from 'prop-types';

import { Container, Repository, Buttons } from './styles';

const CompareList = ({ repositories, handleRemoveRepository, handleRefreshRepository }) => (
  <Container>
    {repositories.map(repository => (
      <Repository key={repository.id}>
        <script>console.log(repository)</script>
        <header>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <strong>{repository.name}</strong>
          <small>{repository.owner.login}</small>
        </header>

        <ul>
          <li>
            {repository.stargazers_count}
            <small>stars</small>
          </li>
          <li>
            {repository.forks_count}
            <small>forks</small>
          </li>
          <li>
            {repository.open_issues_count}
            <small>issues</small>
          </li>
          <li>
            {repository.lastCommit}
            <small>last commit</small>
          </li>
        </ul>
        <Buttons>
          <button
            className="button-delete"
            type="button"
            onClick={handleRemoveRepository.bind(this, repository)}
          >
            Remover
          </button>
          <button
            className="button-update"
            type="button"
            onClick={handleRefreshRepository.bind(this, repository)}
          >
            {repository.loadingUpdate ? <i className="fa fa-spinner fa-pulse" /> : 'Atualizar'}
          </button>
        </Buttons>
      </Repository>
    ))}
  </Container>
);

CompareList.propTypes = {
  repositories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      owner: PropTypes.shape({
        login: PropTypes.string,
        avatar_url: PropTypes.string,
      }),
      stargazers_count: PropTypes.number,
      forks_count: PropTypes.number,
      open_issues_count: PropTypes.number,
      pushed_at: PropTypes.string,
    }),
  ).isRequired,
};

export default CompareList;
