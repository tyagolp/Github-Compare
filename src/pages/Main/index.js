import React, { Component } from 'react';
import moment from 'moment';
import logo from '../../assets/logo.png';

import { Container, Form } from './styles';

import CompareList from '../../components/CompareList/index';
import api from '../../services/api';

// import { Container } from './styles';

export default class Main extends Component {
  state = {
    loading: false,
    repositoryInput: '',
    repositories: [],
    repositoryErro: false,
  };

  componentDidMount() {
    // localStorage.removeItem('repositories');
    if (localStorage.getItem('repositories')) {
      this.setState({
        repositories: JSON.parse(localStorage.repositories),
      });
    }
  }

  handleAddRepository = async (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    const { repositories, repositoryInput } = this.state;

    try {
      const { data: repository } = await api.get(`/repos/${repositoryInput}`);
      repository.lastCommit = moment(repository.pushed_at).fromNow();
      repository.loadingUpdate = false;

      this.setState(
        {
          repositoryInput: '',
          repositoryErro: false,
          repositories: [...repositories, repository],
        },
        () => {
          localStorage.setItem('repositories', JSON.stringify(this.state.repositories));
        },
      );
    } catch (error) {
      this.setState({
        repositoryErro: true,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleRemoveRepository = (repository) => {
    const arr = this.state.repositories;
    const index = arr.indexOf(repository);
    if (index > -1) {
      arr.splice(index, 1);
      this.setState(
        {
          repositories: arr,
        },
        () => {
          localStorage.setItem('repositories', JSON.stringify(this.state.repositories));
        },
      );
    }
  };

  handleRefreshRepository = async (repository) => {
    const arr = this.state.repositories;
    const index = arr.indexOf(repository);
    if (index > -1) {
      arr[index].loadingUpdate = true;
      this.setState(
        {
          repositories: arr,
        },
        () => {
          localStorage.setItem('repositories', JSON.stringify(this.state.repositories));
        },
      );

      const { data } = await api.get(arr[index].url.replace('https://api.github.com', ''));
      data.lastCommit = moment(data.pushed_at).fromNow();
      data.loadingUpdate = false;
      arr[index] = data;

      this.setState(
        {
          repositories: arr,
        },
        () => {
          localStorage.setItem('repositories', JSON.stringify(this.state.repositories));
        },
      );
    }
  };

  render() {
    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form withError={this.state.repositoryErro} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuario/repositorio"
            value={this.state.repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">
            {this.state.loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}
          </button>
        </Form>

        <CompareList
          repositories={this.state.repositories}
          handleRemoveRepository={this.handleRemoveRepository}
          handleRefreshRepository={this.handleRefreshRepository}
        />
      </Container>
    );
  }
}
