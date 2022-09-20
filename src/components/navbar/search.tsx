import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import BasicDatePicker from "./datePicker";
import { CHECK_IN, CHECK_OUT, navigation, menu } from "../../constants/common";
import { Dayjs } from "dayjs";
import { searchPlace } from "../../store/reducers/placesReducer";
import { useDispatch, useSelector } from "react-redux";
import { closeSearch, openSearch } from "../../store/reducers/navBarReducer";

import { RootState } from "../../store/store";
import { IPlace } from "../../types/interface";
import { FetchPlaceApi } from "../../services/place.api";
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

function Search() {
  // router
  const navigate = useNavigate();

  //---redux-----
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.places.selected);
  //-----------
  const [value, setvalue] = useState();
  const [show, setShow] = useState<boolean>(false);
  const containRef = useRef<HTMLDivElement>(null);
  const [checkin, setCheckin] = useState<Dayjs | null>(null);
  const [checkout, setCheckout] = useState<Dayjs | null>(null);
  const [place, setPlace] = useState<any>("");
  const [err, setErr] = useState<{ msg: string; state: boolean }>({
    msg: "",
    state: false,
  });
  //-----------handle search---------------------

  async function handleSearch(e: any) {
    e.preventDefault();
    console.log("search");
    const data = await fetchPlace();
    dispatch(searchPlace({ search: place, data: data }));
    dispatch(closeSearch());
  }

  // ----click close search bar--------------
  useEffect(() => {
    function outsideClose(e: any | undefined) {
      const dialog = document.querySelector('[role="dialog"]');

      if (
        containRef.current &&
        !containRef.current.contains(e.target) &&
        !dialog?.contains(e.target)
      ) {
        setShow(false);
        dispatch(closeSearch());
      }
    }
    document.addEventListener("click", outsideClose, { capture: true });

    return () => {
      document.removeEventListener("click", outsideClose);
    };
  }, [containRef]);

  //-----search effect-----------

  useEffect(() => {
    if (selected.length < 1 && place !== "") {
      return setErr({ state: true, msg: "nơi bạn tìm không có" });
    }
    if (selected.length > 1) navigate("/places");
  }, [selected]);

  //------fetch-----------

  const fetchPlace = async (): Promise<IPlace[]> => {
    const result = await FetchPlaceApi();
    return result.data.slice(0, 50);
  };
  //-----------------------------
  return (
    <Wrapper className="mx-auto mt-2 lg:w-2/3 lg:h-auto sm:w-25">
      <div
        className={`${
          show ? "h-16" : "h-0"
        } transition-all flex flex-col items-center sm:mx-auto overflow-hidden sm:block `}
      >
        <div className="flex mx-auto space-x-4">
          {navigation.map((item, index) => (
            <a
              key={item.name}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 cursor-pointer hover:bg-gray-700 hover:text-white",
                "px-3 py-2 rounded-md  cursor-pointer no-underline text-sm font-medium"
              )}
              aria-current={item.current ? "page" : undefined}
              onClick={() => navigate(`${item.navigate}`)}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      {show ? (
        <div ref={containRef}>
          <form
            className={`${
              show ? "block" : "hidden"
            } flex flex-col items-center justify-between rounded-md 
            sm:flex-row h-auto py-2 px-4 border-2 w-2/3 bg-light sm:w-auto  sm:rounded-full shadow-sm`}
          >
            <div className="flex flex-col w-full  lg:w-1/4 mx-2 ">
              <label id="place" htmlFor="place" className="text-sm ">
                địa điểm
              </label>
              <input
                className="w-2/3 sm:w-5/6"
                id="place"
                type="text"
                onChange={(e) => {
                  setPlace(e.target.value);
                  setErr({ state: false, msg: "" });
                }}
                value={place}
                placeholder=""
              />
              {err.state && (
                <div className="text-red-500 text-sm">*{err.msg}</div>
              )}
            </div>
            <div className="flex flex-col mx-ato w-5/6 sm:w-1/4 ">
              <div className="text-sm text-black">Ngày đi </div>
              <BasicDatePicker
                value={checkin}
                name={"ngày đi"}
                setValue={(newValue: any) => setCheckin(newValue)}
                isSubmit={false}
              />
            </div>
            <div className="flex flex-col mx-ato w-5/6 sm:w-1/4 ">
              <div className="text-sm text-black">Ngày về </div>
              <BasicDatePicker
                name={"ngày về"}
                value={checkout}
                setValue={(newValue: any) => setCheckout(newValue)}
                isSubmit={false}
              />
            </div>
            <div className="w-5/6 flex-shrink-1 sm:w-1/6 lg:ml-4">
              <button onClick={handleSearch}>
                <FaSearch className="rounded-full text-lg p-2 w-10 h-10 bg-red-500 text-white " />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex h-3 sm:h-5 py-4 border-2 justify-center bg-light items-center  sm:w-2/3 rounded-full shadow-sm">
          {menu.map((ele) => {
            return (
              <button
                onClick={() => {
                  setShow(true);
                  dispatch(openSearch());
                }}
                className="z-50 w-1/4 cursor-pointer text-lg"
              >
                {ele.name}
              </button>
            );
          })}
          <FaSearch
            role="button"
            onClick={() => {
              setShow(true);
              dispatch(openSearch());
            }}
            className="rounded-full text-white hover w-8 h-8 bg-red-500 p-2"
          />
        </div>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div``;

export default Search;
